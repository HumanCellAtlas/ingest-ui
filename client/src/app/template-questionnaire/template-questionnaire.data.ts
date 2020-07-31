import * as answerKey from './answer-key.json';

const answers = (answerKey as any).default;

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
  includeModules: string[];
  embedProcess: boolean;
  linkSpec: {
    linkEntities: string[];
    linkProtocols: string[]
  };
}

export class TemplateSpecification {

  private types = new Map<String, TypeSpec>();

  static convert(questionnaire: QuestionnaireData): TemplateSpecification {
    let specification = new TemplateSpecification();
    let recordInfo: boolean = 'experimentInfo' in questionnaire && questionnaire.experimentInfo.toLowerCase() == 'yes';
    for (let question in questionnaire) {
      if (!(question in answers)) continue;
      let userInput = questionnaire[question];
      if (userInput instanceof Array) {
        userInput
          .filter(input => input in answers[question])
          .forEach(input => {
            specification.addTypeSpec(question, input, recordInfo);
          });
      } else {
        if (userInput in answers[question]) {
          specification.addTypeSpec(question, userInput, recordInfo);
        }
      }
    }
    return specification;
  }

  private addTypeSpec(question: string, answer: string, recordInfo: boolean): void {
    answers[question][answer].forEach((ts: TypeSpec) => {
      if (this.types.has(ts.schemaName)) {
        this.merge(this.types.get(ts.schemaName), ts);
      } else {
        //cloning to ensure the source object doesn't get overwritten by merges
        let clone = Object.assign({}, ts);
        clone.embedProcess = 'category' in clone && clone['category'] == 'biomaterial' ? recordInfo : false;
        delete clone['category'];
        this.types.set(ts.schemaName, clone);
      }
    });
  }

  private merge(spec: TypeSpec, other: TypeSpec): void {
    if (spec.schemaName == other.schemaName) {
      let unique = new Set<string>(spec.includeModules);
      other.includeModules.forEach(it => unique.add(it));
      spec.includeModules = [...unique];
    }
  }

  public getTypes(): TypeSpec[] {
    return [...this.types.values()];
  }

}
