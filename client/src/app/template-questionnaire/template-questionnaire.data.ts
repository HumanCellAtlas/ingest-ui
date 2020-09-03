import * as answerKey from './answer-key.json';
import * as defaultFields from './default_fields.json'

const answers = (answerKey as any).default;
const schemaFields = (defaultFields as any).default;

export interface QuestionnaireData {
  technologyType: string[];
  libraryPreparation: string[];
  identifyingOrganisms: string[];
  specimenType: string[];
  experimentInfo: string;
  preNatalQuantity: string;
  donorsRelated: string;
  specimenPurchased: string;
  protocols: string[];
}

export interface TypeSpec {
  schemaName: string;
  includeModules: string[] | 'ALL';
  embedProcess: boolean;
  linkSpec: {
    linkEntities: string[];
    linkProtocols: string[]
  };
}

export function merge(spec: TypeSpec, other: TypeSpec): void {
  if (!spec.linkSpec) {
    spec.linkSpec = {
      linkEntities: [],
      linkProtocols: []
    };
  }
  const entities = new Set<string>(spec.linkSpec.linkEntities);
  other?.linkSpec?.linkEntities?.forEach(e => entities.add(e));
  spec.linkSpec.linkEntities = [...entities];
}

const default_type_specs = [
  {
    schemaName: 'donor_organism',
    category: 'biomaterial',
    includeModules: [
      'genus_species',
      'development_stage',
      'diseases',
      'death',
      'weight'
    ]
  },
  {
    schemaName: 'collection_protocol',
    category: 'other',
    includeModules: 'ALL'
  },
  {
    schemaName: 'specimen_from_organism',
    category: 'biomaterial',
    includeModules: [
      'genus_species',
      'organ',
      'organ_parts',
      'diseases',
      'state_of_specimen',
      'preservation_storage'
    ]
  },
  {
    schemaName: 'cell_suspension',
    category: 'biomaterial',
    includeModules: [
      'cell_morphology',
      'genus_species',
      'selected_cell_types'
    ]
  },
  {
    schemaName: 'library_preparation_protocol',
    category: 'other',
    includeModules: [
      'input_nucleic_acid_molecule',
      'library_construction_method',
      'library_construction_kit',
      'nucleic_acid_conversion_kit',
      'umi_barcode',
      'library_preamplification_method',
      'cdna_library_amplification_method'
    ]
  },
  {
    schemaName: 'sequencing_protocol',
    category: 'other',
    includeModules: [
      'instrument_manufacturer_model',
      'method'
    ]
  }
]

export class TemplateSpecification {
  private types = new Map<String, TypeSpec>();

  static convert(questionnaire: QuestionnaireData): TemplateSpecification {
    let specification = new TemplateSpecification();
    let recordInfo: boolean = 'experimentInfo' in questionnaire && questionnaire.experimentInfo.toLowerCase() == 'yes';
    default_type_specs.forEach((ts: any) => specification.addTypeSpec(ts, recordInfo));
    for (let question in questionnaire) {
      if (!(question in answers)) continue;
      let userInput = questionnaire[question];
      if (userInput instanceof Array) {
        userInput
          .filter(input => input in answers[question])
          .forEach(input => {
            specification.addTypeSpecFromAnswers(question, input, recordInfo);
          });
      } else {
        if (userInput in answers[question]) {
          specification.addTypeSpecFromAnswers(question, userInput, recordInfo);
        }
      }
    }
    return specification;
  }

  private addTypeSpecFromAnswers(question: string, answer: string, recordInfo: boolean): void {
    answers[question][answer].forEach((ts: TypeSpec) => {
      if (this.types.has(ts.schemaName)) {
        this.merge(this.types.get(ts.schemaName), ts);
      } else {
        this.addTypeSpec(ts, recordInfo);
      }
    });
  }

  private addTypeSpec(ts: TypeSpec, recordInfo: boolean): void {
    //cloning to ensure the source object doesn't get overwritten by merges
    let clone = Object.assign({}, ts);
    clone.embedProcess = 'category' in clone && clone['category'] == 'biomaterial' ? recordInfo : false;
    delete clone['category'];
    this.addModules(clone, schemaFields[ts.schemaName]);
    this.types.set(ts.schemaName, clone);
  }

  /*
  Ideally, this should be defined in TypeSpec, but due to my limited understanding of TS interface VS class and its
  implications on built-in JSON typing (i.e. <Type>{ "json": "data" }), it's done this way.
   */
  private merge(spec: TypeSpec, other: TypeSpec): void {
    if (spec.schemaName == other.schemaName) {
      let unique = new Set<string>(spec.includeModules);
      if (other.includeModules == 'ALL') {
        spec.includeModules = other.includeModules;
      } else {
        if (other.includeModules) {
          other.includeModules.forEach(it => unique.add(it));
        }
      }
      spec.includeModules = [...unique];
    }
  }

  //Similar note to merge method.
  private addModules(spec: TypeSpec, fields: string[]): void {
    const modules = new Set<string>(spec.includeModules);
    if (fields) {
      fields.forEach(f => modules.add(f));
      spec.includeModules = [...modules];
    }
  }

  public getTypes(): TypeSpec[] {
    return [...this.types.values()];
  }

}
