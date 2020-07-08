import {MetadataFormLayout} from '../../metadata-schema-form/models/metadata-form-layout';
import {AccessionFieldGroupComponent} from '../accession-field-group/accession-field-group.component';
import {PublicationFieldGroupComponent} from '../publication-field-group/publication-field-group.component';
import {ContactFieldGroupComponent} from '../contact-field-group/contact-field-group.component';
import {ProjectRegistrationSummaryComponent} from '../project-registration-summary/project-registration-summary.component';
import {ProjectIdComponent} from '../project-id/project-id.component';

export const projectRegLayout: MetadataFormLayout = {
  tabs: [
    {
      title: 'Project',
      key: '',
      items: [
        'project.content.project_core.project_title',
        'project.content.project_core.project_description',
        {
          keys: [
            'project.identifyingOrganisms',
            'project.technology',
            'project.content.project_core.project_short_name'
          ],
          component: ProjectIdComponent
        },
        'project.dataAccess.type',
        {
          keys: [
            'project.content.publications.url'
          ],
          component: PublicationFieldGroupComponent
        },
        'project.content.supplementary_links',
        {
          keys: [
            'project.content.array_express_accessions',
            'project.content.biostudies_accessions',
            'project.content.geo_series_accessions',
            'project.content.insdc_project_accessions',
            'project.content.insdc_study_accessions',
            'project.releaseDate',
            'project.accessionDate'
          ],
          component: AccessionFieldGroupComponent
        }
      ]
    },
    {
      title: 'Contacts',
      key: '',
      items: [
        {
          keys: [
            'project.content.array_express_accessions',
            'project.content.biostudies_accessions',
            'project.content.geo_series_accessions',
            'project.content.insdc_project_accessions',
            'project.content.insdc_study_accessions',
            'project.releaseDate',
            'project.accessionDate'
          ],
          component: ContactFieldGroupComponent
        }
      ]
    },
    {
      title: 'Summary',
      key: '',
      items: [
        {
          keys: [],
          component: ProjectRegistrationSummaryComponent
        }
      ]
    }
  ]
};
