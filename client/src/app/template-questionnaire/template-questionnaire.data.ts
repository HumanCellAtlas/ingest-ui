export interface QuestionnaireData {
  technologyType: string[];
  libraryPreparation: string[];
  identifyingOrganisms: string[];
  specimenType: string[];
}

export class TemplateSpecification {

  static convert(data: QuestionnaireData): TemplateSpecification {
    return new TemplateSpecification();
  }

}
