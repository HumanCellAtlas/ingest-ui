import {QuestionnaireData, TemplateSpecification} from "./template-questionnaire.data";

describe('Template Specification conversion', () => {

  [
    {
      answer: 'Sequencing',
      schemaNames: ['dissociation_protocol', 'cell_suspension', 'library_preparation_protocol', 'sequencing_protocol']
    },
    {
      answer: 'imaging',
      schemaNames: ['imaging_protocol', 'imaging_preparation_protocol', 'imaged_specimen']
    }
  ].forEach(param => {
    it(`should correctly translate technology type ${param.answer}`, () => {
      //given:
      const data = <QuestionnaireData>{
        'technologyType': [param.answer]
      };

      //when:
      const specification = TemplateSpecification.convert(data);

      //then:
      expect(specification).not.toBeNull();
      const schemaNames = specification.types.map(t => t.schemaName);
      expect(schemaNames.length).toBe(param.schemaNames.length);
      param.schemaNames.forEach(name => expect(schemaNames).toContain(name));
    });
  });

});
