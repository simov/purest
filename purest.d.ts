
import {
  RequestOptions as RequestComposeOptions,
  AuthOptions,
  ClientResponse,
  BufferResponse,
  StreamResponse,
} from 'request-compose'

// ----------------------------------------------------------------------------

/**
 * Purest instance config
 */
export interface PurestInstanceConfig {
  /**
   * Purest providers config
   */
  config?: PurestConfig
  /**
   * Provider name
   */
  provider?: string
  /**
   * Instance defaults
   */
  defaults?: PurestOptions
  /**
   * Method aliases
   */
  methods?: PurestMethods
}

/**
 * Purest config
 */
export interface PurestConfig {
  /**
   * Provider name
   */
  [provider: string]: {
    [endpoint: string]: PurestOptions | undefined
  } | undefined
}

/**
 * Request options
 */
export interface PurestOptions extends RequestComposeOptions {
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  get?: string
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  head?: string
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  post?: string
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  put?: string
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  patch?: string
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  options?: string
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  delete?: string
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  trace?: string
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  connect?: string
  /**
   * Return the response body as buffer
   */
  buffer?: boolean
  /**
   * Return the response stream
   */
  stream?: boolean
  /**
   * Origin part of the URL
   */
  origin?: string
  /**
   * Path part of the URL; to be used with origin
   */
  path?: string
  /**
   * {subdomain} part of the URL to replace in origin
   */
  subdomain?: string
  /**
   * {version} part of the URL to replace in path
   */
  version?: string
  /**
   * {type} part of the URL to replace in path; usually json or xml
   */
  type?: string
  /**
   * Endpoint name to use
   */
  endpoint?: string
  /**
   * List of values to replace {auth} with, or basic auth
   */
  auth?: string | [] | AuthOptions
}

/**
 * Method Overrides
 */
export interface PurestMethods {
  /**
   * get method aliases
   */
  get?: string[]
  /**
   * head method aliases
   */
  head?: string[]
  /**
   * post method aliases
   */
  post?: string[]
  /**
   * put method aliases
   */
  put?: string[]
  /**
   * patch method aliases
   */
  patch?: string[]
  /**
   * options method aliases
   */
  options?: string[]
  /**
   * delete method aliases
   */
  delete?: string[]
  /**
   * trace method aliases
   */
  trace?: string[]
  /**
   * connect method aliases
   */
  connect?: string[]
  /**
   * method method aliases
   */
  method?: string[]
  /**
   * headers method aliases
   */
  headers?: string[]
  /**
   * timeout method aliases
   */
  timeout?: string[]
  /**
   * agent method aliases
   */
  agent?: string[]
  /**
   * url method aliases
   */
  url?: string[]
  /**
   * proxy method aliases
   */
  proxy?: string[]
  /**
   * qs method aliases
   */
  qs?: string[]
  /**
   * form method aliases
   */
  form?: string[]
  /**
   * json method aliases
   */
  json?: string[]
  /**
   * body method aliases
   */
  body?: string[]
  /**
   * multipart method aliases
   */
  multipart?: string[]
  /**
   * oauth method aliases
   */
  oauth?: string[]
  /**
   * encoding method aliases
   */
  encoding?: string[]
  /**
   * redirect method aliases
   */
  redirect?: string[]
  /**
   * request method aliases
   */
  request?: string[]
  /**
   * buffer method aliases
   */
  buffer?: string[]
  /**
   * stream method aliases
   */
  stream?: string[]
  /**
   * origin method aliases
   */
  origin?: string[]
  /**
   * path method aliases
   */
  path?: string[]
  /**
   * subdomain method aliases
   */
  subdomain?: string[]
  /**
   * version method aliases
   */
  version?: string[]
  /**
   * type method aliases
   */
  type?: string[]
  /**
   * endpoint method aliases
   */
  endpoint?: string[]
  /**
   * auth method aliases
   */
  auth?: string[]
}

// ----------------------------------------------------------------------------

/**
 * Purest request instance
 */
export type PurestRequest = (options: PurestOptions) => Promise<PurestResponse>

/**
 * Purest endpoint instance
 */
export type PurestEndpoint = (endpoint?: string) => PurestAPI

/**
 * Purest chain instance
 */
export interface PurestAPI {
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  get(path?: string): PurestAPI
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  head(path?: string): PurestAPI
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  post(path?: string): PurestAPI
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  put(path?: string): PurestAPI
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  patch(path?: string): PurestAPI
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  options(path?: string): PurestAPI
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  delete(path?: string): PurestAPI
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  trace(path?: string): PurestAPI
  /**
   * Path part to replace the {path} with, or absolute URL
   */
  connect(path?: string): PurestAPI
  /**
   * HTTP method name
   */
  method(name: string): PurestAPI
  /**
   * HTTP headers
   */
  headers(headers: object): PurestAPI
  /**
   * Request timeout in milliseconds, defaults to 3000
   */
  timeout(timeout: number): PurestAPI
  /**
   * HTTP agent
   */
  agent(agent: object): PurestAPI
  /**
   * Absolute URL
   */
  url(url: string): PurestAPI
  /**
   * Proxy URL; for HTTP use Agent instead
   */
  proxy(proxy: string): PurestAPI
  /**
   * URL querystring
   */
  qs(querystring: object | string): PurestAPI
  /**
   * application/x-www-form-urlencoded request body
   */
  form(form: object | string): PurestAPI
  /**
   * JSON encoded request body
   */
  json(json: object | string): PurestAPI
  /**
   * Raw request body
   */
  body(body: string | Buffer | object): PurestAPI
  /**
   * multipart/form-data as object or multipart/related as array
   */
  multipart(body: object | []): PurestAPI
  /**
   * OAuth 1.0a authentication
   */
  oauth(oauth: object): PurestAPI
  /**
   * Response encoding
   */
  encoding(name: string): PurestAPI
  /**
   * Redirect options
   */
  redirect(options: object): PurestAPI
  /**
   * Parsed response body
   */
  request(options?: PurestOptions): Promise<ClientResponse>
  /**
   * Response body as buffer
   */
  buffer(options?: PurestOptions): Promise<BufferResponse>
  /**
   * Response stream
   */
  stream(options?: PurestOptions): Promise<StreamResponse>
  /**
   * Origin part of the URL
   */
  origin(origin: string): PurestAPI
  /**
   * Path part of the URL; to be used with origin
   */
  path(path: string): PurestAPI
  /**
   * {subdomain} part of the URL to replace in origin
   */
  subdomain(subdomain: string): PurestAPI
  /**
   * {version} part of the URL to replace in path
   */
  version(version: string): PurestAPI
  /**
   * {type} part of the URL to replace in path; usually json or xml
   */
  type(type: string): PurestAPI
  /**
   * Endpoint name to use
   */
  endpoint(name: string): PurestAPI
  /**
   * List of values to replace {auth} with
   */
  auth(...values: string[]): PurestAPI
  /**
   * Array of values to replace {auth} with
   */
  auth(value: string[]): PurestAPI
  /**
   * Basic auth
   */
  auth(basic: {user: string, pass: string}): PurestAPI
}

// ----------------------------------------------------------------------------

/**
 * Purest response
 */
export type PurestResponse = ClientResponse & BufferResponse & StreamResponse

// ----------------------------------------------------------------------------

/**
 * Purest
 */
declare function purest (config?: PurestInstanceConfig): PurestRequest & PurestEndpoint & PurestAPI

/**
 * Purest
 */
declare module purest {}

export default purest
