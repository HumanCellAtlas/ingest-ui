import * as answerKey from './answer-key.json';

const answers = (answerKey as any).default;

export interface QuestionnaireData {
  technologyType: string[];
  libraryPreparation: string[];
  identifyingOrganisms: string[];
  specimenType: string[];
}

export class TypeSpec {
  schemaName: string;
  includeModules: Set<string>;
  embedProcess: boolean;
  linkSpec: {
    linkEntities: string[];
    linkProtocols: string[]
  };

  merge(other: TypeSpec): void {
    if (this.schemaName == other.schemaName) {
      other.includeModules.forEach(this.includeModules.add);
    }
  }
}

export class TemplateSpecification {

  private types = new Map<String, TypeSpec>();

  static convert(data: QuestionnaireData): TemplateSpecification {
    let specification = new TemplateSpecification();
    for (let field in data) {
      if (!(field in answers)) continue;
      let answerSection = answers[field];
      data[field]
        .filter(value => value in answerSection)
        .forEach(value => {
          answers[field][value].forEach((ts: TypeSpec) => {
            specification.types.set(ts.schemaName, ts);
          });
        });
    }
    return specification;
  }

  public getTypes(): TypeSpec[] {
    return [...this.types.values()];
  }

}
