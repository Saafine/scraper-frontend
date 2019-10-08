export interface QueryConfiguration extends SearchQueryDTO {
  label: string;
}

export interface SearchQueryDTO {
  url: string;
  items: SearchItemDTO[];
}

export interface SearchItemDTO {
  label: string;
  selector: string;
  readMethod: string;
}

export type QueryConfigurationValue = string[];
export type QueryConfigurationLabel = string;

export interface QuerySearchResponse {
  queryHash: string;
  data: {
    labels: QueryConfigurationLabel[];
    values: QueryConfigurationValue[];
  };
}

export interface QuerySearchIgnoreDTO {
  queryHash: string;
  values: any[];
}

export interface ResultView {
  labels: QueryConfigurationLabel[];
  values: QueryConfigurationValue[];
  queryHash: string;
}
