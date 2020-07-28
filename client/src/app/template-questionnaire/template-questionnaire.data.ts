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
  types: TypeSpec[];

  static convert(data: QuestionnaireData): TemplateSpecification {
    return new TemplateSpecification();
  }

}
