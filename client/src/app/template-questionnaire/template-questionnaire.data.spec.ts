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
  });

});
