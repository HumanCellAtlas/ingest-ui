import * as answerKey from './answer-key.json';

const answers = (answerKey as any).default;

export interface QuestionnaireData {
  technologyType: string[];
  libraryPreparation: string[];
  identifyingOrganisms: string[];
  specimenType: string[];
}

interface TypeSpec {
  schemaName: string;
  excludeModules: string[];
  excludeFields: string[];
  embedProcess: boolean;
  linkSpec: {
    linkEntities: string[];
    linkProtocols: string[]
  };
}


export class TemplateSpecification {

  types = [] as TypeSpec[];

  static convert(data: QuestionnaireData): TemplateSpecification {
    let specification = new TemplateSpecification();
    for (let field in data) {
      if (!(field in answers)) continue;
      let answerSection = answers[field];
      data[field]
        .filter(value => value in answerSection)
        .forEach(value => {
          answers[field][value].forEach((ts: TypeSpec) => specification.types.push(ts));
        });
    }
    return specification;
  }

}
