import * as answerKey from './answer-key.json';
import {camelCase} from "@swimlane/ngx-datatable";

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
    data.technologyType
      .map(camelCase)
      .filter(type => type in answerKey.technology)
      .forEach(type => {
        answerKey.technology[type].forEach((ts: TypeSpec) => specification.types.push(ts));
      });
    return specification;
  }

}
