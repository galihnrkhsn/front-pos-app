let timeout

const IDLE_TIME = 15 * 60 * 1000;

export function startIdleTime(onIdle) {
    resetIdleTimer(onIdle)

    const events = ['mousewave', 'keydown', 'click', 'scroll', 'touchstart']

    events.forEach(event => {
        window.addEventListener(event, () => resetIdleTimer(onIdle))
    })

    function resetIdleTimer(onIdle){
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => {
            onIdle()
        }, IDLE_TIME)
    }
}