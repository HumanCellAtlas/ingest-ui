# Ontology Search

HCA OLS URL : https://ontology.staging.archive.data.humancellatlas.org/ (staging)

Example Project Role (Contributor Role) schema:

```
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "https://schema.dev.data.humancellatlas.org/module/ontology/1.0.0/contributor_role_ontology",
	"description": "A term that describes the role of a contributor in the project.",
	"additionalProperties": false,
	"required": [
		"text"
	],
	"title": "Contributor role ontology",
	"name": "contributor_role_ontology",
	"type": "object",
	"properties": {
		"describedBy": {
			"description": "The URL reference to the schema.",
			"pattern": "^(http|https)://schema.(.*?)humancellatlas.org/module/ontology/(([0-9]{1,}.[0-9]{1,}.[0-9]{1,})|([a-zA-Z]*?))/contributor_role_ontology",
			"type": "string"
		},
		"schema_version": {
			"description": "Version number in major.minor.patch format.",
			"type": "string",
			"pattern": "^[0-9]{1,}.[0-9]{1,}.[0-9]{1,}$",
			"example": "4.6.1"
		},
		"text": {
			"description": "The primary role of the contributor in the project.",
			"type": "string",
			"example": "principal investigator; experimental scientist",
			"user_friendly": "Contributor role"
		},
		"ontology": {
			"description": "An ontology term identifier in the form prefix:accession.",
			"type": "string",
			"graph_restriction": {
				"ontologies": [
					"obo:efo"
				],
				"classes": [
					"EFO:0002012"
				],
				"relations": [
					"rdfs:subClassOf"
				],
				"direct": false,
				"include_self": false
			},
			"example": "EFO:0009736; EFO:0009741",
			"user_friendly": "Contributor role ontology ID"
		},
		"ontology_label": {
			"description": "The preferred label for the ontology term referred to in the ontology field. This may differ from the user-supplied value in the text field.",
			"type": "string",
			"example": "principal investigator; experimental scientist",
			"user_friendly": "Contributor role ontology label"
		}
	}
}
```
Given a `ontology.classes`  has value `EFO:0002012` :

1. Find IRI of `EFO:0002012`
https://ontology.staging.archive.data.humancellatlas.org/api/select?q=EFO_0002012

```
{
	"responseHeader": {
		"status": 0,
		"QTime": 0,
		"params": {
			"hl": "true",
			"fl": "iri,ontology_name,ontology_prefix,short_form,label,id,type,obo_id",
			"start": "0",
			"fq": "is_obsolete:false",
			"rows": "10",
			"hl.simple.pre": "<b>",
			"bq": "type:ontology^10.0 is_defining_ontology:true^100.0 label_s:\"efo_0002012\"^1000  label_autosuggest_e:\"efo_0002012\"^500 synonym_s:\"efo_0002012\" synonym_autosuggest_e:\"efo_0002012\"^100",
			"q": "EFO_0002012",
			"defType": "edismax",
			"hl.simple.post": "</b>",
			"qf": "label synonym label_autosuggest_e label_autosuggest synonym_autosuggest_e synonym_autosuggest shortform_autosuggest iri",
			"hl.fl": ["label_autosuggest", "label", "synonym_autosuggest", "synonym"],
			"wt": "json"
		}
	},
	"response": {
		"numFound": 1,
		"start": 0,
		"docs": [{
			"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0002012",
			"iri": "http://www.ebi.ac.uk/efo/EFO_0002012",
			"short_form": "EFO_0002012",
			"obo_id": "EFO:0002012",
			"label": "organization role",
			"ontology_name": "efo",
			"ontology_prefix": "EFO",
			"type": "class"
		}]
	},
	"highlighting": {
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0002012": {}
	}
}
```

2. Given `ontology.relations` `rdfs:subClassOf` supply param `allChildrenOf` with value of IRI from #1.

https://ontology.staging.archive.data.humancellatlas.org/api/select?groupField=iri&start=0&ontology=efo&q=*&rows=30&allChildrenOf=http://www.ebi.ac.uk/efo/EFO_0002012

```
{
	"responseHeader": {
		"status": 0,
		"QTime": 1,
		"params": {
			"hl": "true",
			"fl": "iri,ontology_name,ontology_prefix,short_form,label,id,type,obo_id",
			"start": "0",
			"fq": [
				"ontology_name: (efo)",
				"hierarchical_ancestor_iri: (\"http://www.ebi.ac.uk/efo/EFO_0002012\")",
				"is_obsolete:false"
			],
			"rows": "30",
			"hl.simple.pre": "<b>",
			"bq": "type:ontology^10.0 is_defining_ontology:true^100.0 label_s:\"*\"^1000  label_autosuggest_e:\"*\"^500 synonym_s:\"*\" synonym_autosuggest_e:\"*\"^100",
			"q": "*",
			"defType": "edismax",
			"hl.simple.post": "</b>",
			"qf": "label synonym label_autosuggest_e label_autosuggest synonym_autosuggest_e synonym_autosuggest shortform_autosuggest iri",
			"hl.fl": [
				"label_autosuggest",
				"label",
				"synonym_autosuggest",
				"synonym"
			],
			"wt": "json"
		}
	},
	"response": {
		"numFound": 26,
		"start": 0,
		"docs": [{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0009742",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0009742",
				"short_form": "EFO_0009742",
				"obo_id": "EFO:0009742",
				"label": "computational scientist",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0009743",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0009743",
				"short_form": "EFO_0009743",
				"obo_id": "EFO:0009743",
				"label": "administrator",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0009740",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0009740",
				"short_form": "EFO_0009740",
				"obo_id": "EFO:0009740",
				"label": "clinician",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0009741",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0009741",
				"short_form": "EFO_0009741",
				"obo_id": "EFO:0009741",
				"label": "experimental scientist",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0009739",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0009739",
				"short_form": "EFO_0009739",
				"obo_id": "EFO:0009739",
				"label": "technician",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0009735",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0009735",
				"short_form": "EFO_0009735",
				"obo_id": "EFO:0009735",
				"label": "co-investigator",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0009736",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0009736",
				"short_form": "EFO_0009736",
				"obo_id": "EFO:0009736",
				"label": "principal investigator",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0009737",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0009737",
				"short_form": "EFO_0009737",
				"obo_id": "EFO:0009737",
				"label": "data curator",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0009738",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0009738",
				"short_form": "EFO_0009738",
				"obo_id": "EFO:0009738",
				"label": "pathologist",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001736",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001736",
				"short_form": "EFO_0001736",
				"obo_id": "EFO:0001736",
				"label": "funder",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001735",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001735",
				"short_form": "EFO_0001735",
				"obo_id": "EFO:0001735",
				"label": "data coder",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001738",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001738",
				"short_form": "EFO_0001738",
				"obo_id": "EFO:0001738",
				"label": "institution",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001737",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001737",
				"short_form": "EFO_0001737",
				"obo_id": "EFO:0001737",
				"label": "hardware manufacturer",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001739",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001739",
				"short_form": "EFO_0001739",
				"obo_id": "EFO:0001739",
				"label": "investigator",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001741",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001741",
				"short_form": "EFO_0001741",
				"obo_id": "EFO:0001741",
				"label": "submitter",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001740",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001740",
				"short_form": "EFO_0001740",
				"obo_id": "EFO:0001740",
				"label": "software manufacturer",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001729",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001729",
				"short_form": "EFO_0001729",
				"obo_id": "EFO:0001729",
				"label": "biomaterial provider",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001728",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001728",
				"short_form": "EFO_0001728",
				"obo_id": "EFO:0001728",
				"label": "array manufacturer",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001730",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001730",
				"short_form": "EFO_0001730",
				"obo_id": "EFO:0001730",
				"label": "biosequence provider",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001732",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001732",
				"short_form": "EFO_0001732",
				"obo_id": "EFO:0001732",
				"label": "consultant",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001731",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001731",
				"short_form": "EFO_0001731",
				"obo_id": "EFO:0001731",
				"label": "consortium member",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001734",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001734",
				"short_form": "EFO_0001734",
				"obo_id": "EFO:0001734",
				"label": "data analyst",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0001733",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0001733",
				"short_form": "EFO_0001733",
				"obo_id": "EFO:0001733",
				"label": "curator",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0004447",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0004447",
				"short_form": "EFO_0004447",
				"obo_id": "EFO:0004447",
				"label": "peer review quality control role",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://www.ebi.ac.uk/efo/EFO_0000647",
				"iri": "http://www.ebi.ac.uk/efo/EFO_0000647",
				"short_form": "EFO_0000647",
				"obo_id": "EFO:0000647",
				"label": "experiment performer",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			},
			{
				"id": "efo:class:http://purl.obolibrary.org/obo/OBI_0000018",
				"iri": "http://purl.obolibrary.org/obo/OBI_0000018",
				"short_form": "OBI_0000018",
				"obo_id": "OBI:0000018",
				"label": "material supplier role",
				"ontology_name": "efo",
				"ontology_prefix": "EFO",
				"type": "class"
			}
		]
	},
	"highlighting": {
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0009742": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0009743": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0009740": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0009741": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0009739": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0009735": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0009736": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0009737": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0009738": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001736": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001735": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001738": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001737": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001739": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001741": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001740": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001729": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001728": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001730": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001732": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001731": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001734": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0001733": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0004447": {},
		"efo:class:http://www.ebi.ac.uk/efo/EFO_0000647": {},
		"efo:class:http://purl.obolibrary.org/obo/OBI_0000018": {}
	}
}
```
