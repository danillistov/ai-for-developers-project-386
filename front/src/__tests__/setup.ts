import { config } from '@vue/test-utils'

config.global.stubs = {
  RouterLink: { template: '<a data-testid="router-link"><slot /></a>' },
  RouterView: { template: '<div data-testid="router-view"><slot /></div>' },
}
