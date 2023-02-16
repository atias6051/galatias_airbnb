// const tester = "2023-01-26T07:49:29.000Z"
const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export default function formatDate(date){
    const [year,month] = date.split('-')
    return [monthsArr[month-1], year].join(' ')
}
