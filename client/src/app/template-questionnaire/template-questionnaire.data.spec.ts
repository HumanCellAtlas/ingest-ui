import {QuestionnaireData, TemplateSpecification} from "./template-questionnaire.data";

describe('Template Specification conversion', () => {

  it('should correctly translate technology type', () => {
    //given:
    const data = <QuestionnaireData> {
      'technologyType': ['Sequencing']
    }

    //when:
    const spec = TemplateSpecification.convert(data);

    //then:
    expect(spec).not.toBeNull();
    const schemaNames = spec.types.map(t => t.schemaName);
    expect(schemaNames.length).toBe(4);

    //and:
    ['dissociation_protocol', 'cell_suspension', 'library_preparation_protocol', 'sequencing_protocol']
      .forEach(it => expect(schemaNames).toContain(it));
  });

});
