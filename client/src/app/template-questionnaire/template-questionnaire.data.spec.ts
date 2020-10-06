import {merge, QuestionnaireData, TemplateSpecification, TypeSpec} from './template-questionnaire.data';

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
      schemaNames: ['sequencing_protocol', 'library_preparation_protocol']
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
      // given:
      const data = <QuestionnaireData>{};
      if (param.arrayType) {
        data[param.question] = [param.answer];
      } else {
        data[param.question] = param.answer;
      }

      // when:
      const specification = TemplateSpecification.convert(data);

      // then:
      expect(specification).not.toBeNull();
      const schemaNames = specification.getTypes().map(t => t.schemaName);
      param.schemaNames.forEach(name => expect(schemaNames).toContain(name));
    });
  });

  it('should ensure type specifications are unique', () => {
    // given:
    const data = <QuestionnaireData>{
      identifyingOrganisms: ['Human', 'Mouse']
    };

    // when:
    const specification = TemplateSpecification.convert(data);

    // then:
    const types = specification.getTypes();
    const typeSpecs = types.filter(ts => ts.schemaName === 'donor_organism');
    expect(typeSpecs.length).toBe(1);

    // and:
    const donorOrganism = types[0];
    const expectedModules = ['human_specific', 'mouse_specific'];
    expect(donorOrganism.includeModules.length >= expectedModules.length).toBe(true);
    expectedModules.forEach(module => expect(donorOrganism.includeModules).toContain(module));
  });

  it('should embed process into biomaterials (except donors) when experiment info are recorded', () => {
    // given:
    const data = <QuestionnaireData>{
      experimentInfo: 'Location, time and performer of the experimental processes',
      identifyingOrganisms: ['Mouse'],
      libraryPreparation: ['Other']
    };

    // when:
    const specification = TemplateSpecification.convert(data);

    // then:
    // TODO should library_preparation_protocol have embedded process???
    // where is embedProcess being used?
    // the spreadsheet doesn't seem to have any process column for these worksheets
    const entities_with_process = new Set<string>([
      'cell_suspension', 'specimen_from_organism', 'library_preparation_protocol'
    ]);
    specification.getTypes().forEach(ts => {
      expect(ts.embedProcess).withContext(ts.schemaName).toBe(entities_with_process.has(ts.schemaName));
      console.log(ts.schemaName, ts.embedProcess);
    });
  });

});

describe('Merging', () => {

  it('should merge included modules', () => {
    // given:
    const modules = <TypeSpec>{
      schemaName: 'name',
      includeModules: ['contributors', 'funders']
    };
    const otherModules = <TypeSpec>{
      schemaName: 'name',
      includeModules: ['funders', 'contacts']
    };

    // when:
    merge(modules, otherModules);

    // then:
    expect(modules.includeModules).toEqual(['contributors', 'funders', 'contacts']);
  });

  [
    {
      schemaName: 'name',
      spec: <TypeSpec>{includeModules: ['contacts']},
      other: <TypeSpec>{includeModules: 'ALL'}
    },
    {
      schemaName: 'name',
      spec: <TypeSpec>{includeModules: 'ALL'},
      other: <TypeSpec>{includeModules: ['contacts', 'contributors']}
    }
  ].forEach((param, index) => {
    it(`should merge included modules set to ALL (var ${index + 1})`, () => {
      // given:
      const spec = param.spec;
      const other = param.other;

      // when:
      merge(spec, other);

      // then:
      expect(spec.includeModules).toEqual('ALL');
    });
  });

  it('should merge modules with matching schema names', () => {
    // given:
    const donor = <TypeSpec>{
      schemaName: 'donor_organism',
      includeModules: []
    };
    const otherDonor = <TypeSpec>{
      schemaName: 'donor_organism',
      includeModules: ['name']
    };
    const imageFile = <TypeSpec>{
      schemaName: 'image_file',
      includeModules: ['file_name']
    };

    // when:
    merge(donor, otherDonor);
    merge(donor, imageFile);

    // then:
    expect(donor.includeModules).toEqual(otherDonor.includeModules);
  });

  it('should merge empty linking specifications', () => {
    // given:
    const empty = <TypeSpec>{schemaName: 'name'};
    const otherEmpty = <TypeSpec>{schemaName: 'name'};

    // when:
    merge(empty, otherEmpty);

    // then:
    expect(empty.linkSpec).not.toBeUndefined();
    expect(empty.linkSpec.linkEntities).toEqual([]);
    expect(empty.linkSpec.linkProtocols).toEqual([]);
  });

  it('should merge link entities', () => {
    // given:
    const entities = <TypeSpec>{
      schemaName: 'name',
      linkSpec: {
        linkEntities: ['organoid', 'specimen_from_organism']
      }
    };
    const otherEntities = <TypeSpec>{
      schemaName: 'name',
      linkSpec: {
        linkEntities: ['donor_organism', 'organoid']
      }
    };

    // when:
    merge(entities, otherEntities);

    // then:
    expect(entities.linkSpec).not.toBeUndefined();
    expect(entities.linkSpec.linkEntities).toEqual(['organoid', 'specimen_from_organism', 'donor_organism']);
  });

  it('should merge link protocols', () => {
    // given:
    const protocols = <TypeSpec>{
      schemaName: 'name',
      linkSpec: {
        linkProtocols: ['dissociation_protocol', 'sequencing_protocol']
      }
    };
    const otherProtocols = <TypeSpec>{
      schemaName: 'name',
      linkSpec: {
        linkProtocols: ['sequencing_protocol', 'analysis_protocol']
      }
    };

    // when:
    merge(protocols, otherProtocols);

    // then:
    expect(protocols.linkSpec).not.toBeUndefined();
    const merged_protocols = ['dissociation_protocol', 'sequencing_protocol', 'analysis_protocol'];
    expect(protocols.linkSpec.linkProtocols).toEqual(merged_protocols);
  });

});
