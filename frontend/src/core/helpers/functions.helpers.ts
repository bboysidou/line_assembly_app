interface FormatDate {
  date: string
  time: string
  full: string
  fullHoursMinutes: string
}
export const timeSince = (timestamp: string | number | Date): string => {
  const now = new Date()
  const sentTime = new Date(timestamp)
  const seconds = Math.floor((now.getTime() - sentTime.getTime()) / 1000)

  if (seconds < 60) return `${seconds} seconds ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`

  return formatDate(timestamp.toString()).fullHoursMinutes
}

export const formatDate = (dateString: string | undefined): FormatDate => {
  if (dateString === undefined || dateString === null || dateString === '') {
    return {
      date: 'N/A',
      time: 'N/A',
      full: 'N/A',
      fullHoursMinutes: 'N/A'
    }
  }
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone
  }

  const formatter = new Intl.DateTimeFormat('en-GB', options)
  const parts = formatter.formatToParts(date)

  const dateParts: { [key: string]: string } = {}
  parts.forEach(part => {
    if (part.type !== 'literal') {
      dateParts[part.type] = part.value
    }
  })

  return {
    date: `${dateParts.year}-${dateParts.month}-${dateParts.day}`,
    time: `${dateParts.hour}:${dateParts.minute}:${dateParts.second}`,
    full: `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`,
    fullHoursMinutes: `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}`
  }
}

export const getRandomDarkHexColor = (): string => {
  const getDarkComponent = () =>
    Math.floor(Math.random() * 136)
      .toString(16)
      .padStart(2, '0')
  return `#${getDarkComponent()}${getDarkComponent()}${getDarkComponent()}`
}
