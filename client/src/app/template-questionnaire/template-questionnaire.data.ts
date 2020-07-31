import * as answerKey from './answer-key.json';

const answers = (answerKey as any).default;

export interface QuestionnaireData {
  technologyType: string[];
  libraryPreparation: string[];
  identifyingOrganisms: string[];
  specimenType: string[];
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

  static convert(data: QuestionnaireData): TemplateSpecification {
    let specification = new TemplateSpecification();
    for (let field in data) {
      if (!(field in answers)) continue;
      let answerSection = answers[field];
      data[field]
        .filter(value => value in answerSection)
        .forEach(value => {
          answers[field][value].forEach((ts: TypeSpec) => {
            if (specification.types.has(ts.schemaName)) {
              TemplateSpecification.merge(ts, specification.types.get(ts.schemaName));
            }
            specification.types.set(ts.schemaName, ts);
          });
        });
    }
    return specification;
  }

  private static merge(spec: TypeSpec, other: TypeSpec): void {
    if (spec.schemaName == other.schemaName) {
      other.includeModules.forEach(it => spec.includeModules.push(it));
    }
  }

  public getTypes(): TypeSpec[] {
    return [...this.types.values()];
  }

}
