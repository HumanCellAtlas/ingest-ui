import {merge, QuestionnaireData, TemplateSpecification, TypeSpec} from "./template-questionnaire.data";

describe('Template Specification conversion', () => {

  /*
  This parameterised test does not exhaustively test all possible combinations of questions, answers, and
  expected schema mapping. The goal is to add here some representative translation, and any additional ones
  that do not easily conform to the JSON file mapping (implementation detail).

  Some of the mappings are tested implicitly by other tests in this suite.
   */
  [
    {
      question: 'technologyType',
      answer: 'Sequencing',
      arrayType: true,
      schemaNames: ['dissociation_protocol', 'cell_suspension', 'library_preparation_protocol', 'sequencing_protocol']
    },
    {
      question: 'technologyType',
      answer: 'Imaging',
      arrayType: true,
      schemaNames: ['imaging_protocol', 'imaging_preparation_protocol', 'imaged_specimen']
    },
    {
      question: 'libraryPreparation',
      answer: 'Droplet-based (e.g. 10X chromium, dropSeq, InDrop)',
      arrayType: true,
      schemaNames: ['sequencing_protocol', 'library_preparation']
    },
    {
      question: 'libraryPreparation',
      answer: 'Plate-based (e.g. SmartSeq2)',
      arrayType: true,
      schemaNames: ['cell_suspension']
    },
    {
      question: 'preNatalQuantity',
      answer: 'Yes, All',
      arrayType: false,
      schemaNames: ['donor_organism']
    },
    {
      question: 'preNatalQuantity',
      answer: 'No, None',
      arrayType: false,
      schemaNames: []
    }
  ].forEach(param => {
    it(`should correctly translate ${param.question} "${param.answer}"`, () => {
      //given:
      const data = <QuestionnaireData>{};
      if (param.arrayType) {
        data[param.question] = [param.answer];
      } else {
        data[param.question] = param.answer;
      }

      //when:
      const specification = TemplateSpecification.convert(data);

      //then:
      expect(specification).not.toBeNull();
      const schemaNames = specification.getTypes().map(t => t.schemaName);
      param.schemaNames.forEach(name => expect(schemaNames).toContain(name));
    });
  });

  it('should ensure type specifications are unique', () => {
    //given:
    const data = <QuestionnaireData>{
      identifyingOrganisms: ['Human', 'Mouse']
    };

    //when:
    const specification = TemplateSpecification.convert(data);

    //then:
    const types = specification.getTypes();
    const typeSpecs = types.filter(ts => ts.schemaName == 'donor_organism');
    expect(typeSpecs.length).toBe(1);

    //and:
    const donorOrganism = types[0];
    const expectedModules = ['human_specific', 'medical_history', 'height_unit', 'mouse_specific'];
    expect(donorOrganism.includeModules.length >= expectedModules.length).toBe(true);
    expectedModules.forEach(module => expect(donorOrganism.includeModules).toContain(module));
  });

  it('should embed process into biomaterials when experiment info are recorded', () => {
    //given:
    const data = <QuestionnaireData>{
      experimentInfo: 'Yes',
      identifyingOrganisms: ['Mouse'],
      libraryPreparation: ['Other']
    };

    //when:
    const specification = TemplateSpecification.convert(data);

    //then:
    const biomaterials = new Set<string>([
      'donor_organism', 'cell_suspension',
      'library_preparation', 'specimen_from_organism'
    ]);
    specification.getTypes().forEach(ts => {
      expect(ts.embedProcess).withContext(ts.schemaName).toBe(biomaterials.has(ts.schemaName));
    });
  });

});

describe('Merging', () => {

  it('should merge empty linking specifications', () => {
    //given:
    const empty = <TypeSpec> {};
    const otherEmpty = <TypeSpec> {};

    //when:
    merge(empty, otherEmpty);

    //then:
    expect(empty.linkSpec).not.toBeUndefined();
    expect(empty.linkSpec.linkEntities).toEqual([]);
    expect(empty.linkSpec.linkProtocols).toEqual([]);
  });

  it('should merge link entities', () => {
    //given:
    const entities = <TypeSpec> {
      linkSpec: {
        linkEntities: ['organoid', 'specimen_from_organism']
      }
    };
    const otherEntities = <TypeSpec> {
      linkSpec: {
        linkEntities: ['donor_organism', 'organoid']
      }
    };

    //when:
    merge(entities, otherEntities);

    //then:
    expect(entities.linkSpec).not.toBeUndefined();
    expect(entities.linkSpec.linkEntities).toEqual(['organoid', 'specimen_from_organism', 'donor_organism']);
  });

});
