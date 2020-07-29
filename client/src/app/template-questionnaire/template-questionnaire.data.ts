import * as answerKey from './answer-key.json';

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
    answerKey.technology.sequencing.forEach((t: TypeSpec) => specification.types.push(t));
    return specification;
  }

}
