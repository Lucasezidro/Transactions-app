import { BookingsList } from './bookings-list'
import { CreateBooking } from './create-booking'

interface BookingsProps {
  params: {
    userId: string
  }
}

export default function Bookings({ params }: BookingsProps) {
  const userId = params.userId

  return (
    <main>
      <main className="flex flex-col items-center justify-center gap-8 w-full p-8">
        <h1 className="text-2xl font font-extrabold">Agendamentos</h1>
        <CreateBooking userId={userId} />
        <BookingsList userId={userId} />
      </main>
    </main>
  )
}
