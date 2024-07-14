import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/pt-br"

dayjs.locale('pt-bt')
dayjs.extend(localizedFormat)

export { dayjs }