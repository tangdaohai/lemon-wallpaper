let lemonConfig: LemonConfig

export function set (config: LemonConfig) {
  lemonConfig = config
}

export function get () {
  return lemonConfig
}

export interface LemonConfig {
  downLoadPath: string;
}
