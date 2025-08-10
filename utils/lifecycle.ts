export const initAgent = (name: string) => {
  console.log(`[init] Agent ${name} activated at ${new Date().toISOString()}`)
}

export const shutdownAgent = (name: string) => {
  console.log(`[shutdown] Agent ${name} deactivated.`)
}

export const heartbeat = (name: string) => {
  console.log(`[heartbeat] Agent ${name} is alive.`)
}
