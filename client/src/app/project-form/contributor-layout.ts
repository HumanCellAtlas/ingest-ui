import {MetadataFormLayout} from '../metadata-schema-form/models/metadata-form-layout';
import {AccessionFieldGroupComponent} from '../project-registration/accession-field-group/accession-field-group.component';
import {PublicationFieldGroupComponent} from '../project-registration/publication-field-group/publication-field-group.component';
import {ContactFieldGroupComponent} from '../project-registration/contact-field-group/contact-field-group.component';
import {ProjectRegistrationSummaryComponent} from '../project-registration/project-registration-summary/project-registration-summary.component';
import {ProjectIdComponent} from '../project-registration/project-id/project-id.component';

export const contributorLayout: MetadataFormLayout = {
  tabs: [
    {
      title: 'Project',
      key: '',
      items: [
        'project.content.project_core.project_title',
        'project.content.project_core.project_description',
        {
          keys: [
            'project.content.project_core.project_short_name'
          ],
          component: ProjectIdComponent
        },
        'project.dataAccess.type',
        'project.identifyingOrganisms',
        'project.technology',
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
