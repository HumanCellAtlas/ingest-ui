import * as answerKey from './answer-key.json';
import * as defaultFields from './default_fields.json';

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
  timecourseBiomaterialType: string[];
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

/*
  Ideally, this should be defined in TypeSpec, but due to my limited understanding of TS interface VS class and its
  implications on built-in JSON typing (i.e. <Type>{ "json": "data" }), it's done this way.
*/
export function merge(spec: TypeSpec, other: TypeSpec): void {
  if (!spec || !other || spec.schemaName !== other.schemaName) { return; }
  if (!spec.linkSpec) {
    spec.linkSpec = {
      linkEntities: [],
      linkProtocols: []
    };
  }
  if (other.includeModules === 'ALL') {
    spec.includeModules = other.includeModules;
  } else if (spec.includeModules !== 'ALL') {
    spec.includeModules = union(spec.includeModules, other.includeModules);
  }
  spec.linkSpec.linkEntities = union(spec.linkSpec.linkEntities, other.linkSpec?.linkEntities);
  spec.linkSpec.linkProtocols = union(spec.linkSpec.linkProtocols, other.linkSpec?.linkProtocols);
}

function union(a: string[], b: string[]): string[] {
  const result = new Set<string>(a);
  b?.forEach(i => result.add(i));
  return [...result];
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
      'is_living',
      'weight',
      'weight_unit',
      'sex',
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
      'diseases'
    ],
    linkSpec: {
          'linkEntities': [
            'donor_organism'
          ],
          'linkProtocols': [
            'collection_protocol'
          ]
        }
  }
];

export class TemplateSpecification {
  private types = new Map<String, TypeSpec>();

  static convert(questionnaire: QuestionnaireData): TemplateSpecification {
    const specification = new TemplateSpecification();
    const recordInfo: boolean = 'experimentInfo' in questionnaire &&
      questionnaire.experimentInfo.includes('Location, time and performer of the experimental processes');
    default_type_specs.forEach((ts: any) => specification.addTypeSpec(ts, recordInfo));
    for (const question in questionnaire) {
      if (!(question in answers)) { continue; }
      const userInput = questionnaire[question];
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
        merge(this.types.get(ts.schemaName), ts);
      } else {
        this.addTypeSpec(ts, recordInfo);
      }
    });
  }

  private addTypeSpec(ts: TypeSpec, recordInfo: boolean): void {
    // cloning to ensure the source object doesn't get overwritten by merges
    const clone = Object.assign({}, ts);
    clone.embedProcess = ('category' in clone &&
      clone['schemaName'] !== 'donor_organism' &&
      clone['category'] === 'biomaterial'
    ) ? recordInfo : false;
    delete clone['category'];
    this.addModules(clone, schemaFields[ts.schemaName]);
    this.types.set(ts.schemaName, clone);
  }

  // Similar note to merge method.
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
