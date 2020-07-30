import {QuestionnaireData, TemplateSpecification} from "./template-questionnaire.data";

describe('Template Specification conversion', () => {

  /*
  This parameterised test does not exhaustively test all possible combinations of questions, answers, and
  expected schema mapping. The goal is to add here some representative translation, and any additional ones
  that do not easily conform to the JSON file mapping.
   */
  [
    {
      question: 'technologyType',
      answer: 'Sequencing',
      schemaNames: ['dissociation_protocol', 'cell_suspension', 'library_preparation_protocol', 'sequencing_protocol']
    },
    {
      question: 'technologyType',
      answer: 'Imaging',
      schemaNames: ['imaging_protocol', 'imaging_preparation_protocol', 'imaged_specimen']
    },
    {
      question: 'libraryPreparation',
      answer: 'Droplet-based (e.g. 10X chromium, dropSeq, InDrop)',
      schemaNames: ['sequencing_protocol', 'library_preparation']
    },
    {
      question: 'libraryPreparation',
      answer: 'Plate-based (e.g. SmartSeq2)',
      schemaNames: ['cell_suspension']
    }
  ].forEach(param => {
    it(`should correctly translate ${param.question} "${param.answer}"`, () => {
      //given:
      const data = <QuestionnaireData> {};
      data[param.question] = [param.answer];

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
