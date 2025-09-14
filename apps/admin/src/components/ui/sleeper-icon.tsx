import { FaBed } from 'react-icons/fa'

interface SleeperIconProps {
  className?: string
}

export function SleeperIcon({ className = "h-6 w-6" }: SleeperIconProps) {
  return <FaBed className={`${className} text-purple-600 dark:text-purple-400`} />
}
