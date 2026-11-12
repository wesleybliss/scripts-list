import { type InspectColor, styleText } from 'node:util'

export const paint = (format: InspectColor | InspectColor[], text: string, enabled: boolean) => {
    if (!enabled) return text
    return styleText(format, text, { validateStream: false })
}
