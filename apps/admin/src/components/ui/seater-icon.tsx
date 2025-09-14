import { MdOutlineAirlineSeatReclineExtra } from 'react-icons/md'

interface SeaterIconProps {
  className?: string
}

export function SeaterIcon({ className = "h-6 w-6" }: SeaterIconProps) {
  return <MdOutlineAirlineSeatReclineExtra className={`${className} text-blue-600 dark:text-blue-400`} />
}
