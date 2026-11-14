/** The public address of a shop, on whatever host the app is running (localhost, a LAN IP, or production). */
export const shopPath = (slug: string) => `/s/${slug}`

export const shopUrl = (slug: string) => `${window.location.origin}${shopPath(slug)}`

/** The address without the protocol, for showing on screen: "localhost:5173/s/maple". */
export const shopUrlLabel = (slug: string) => `${window.location.host}${shopPath(slug)}`
