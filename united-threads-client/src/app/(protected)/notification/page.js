import NotificationContainer from "./_components/NotificationContainer";

export const metadata = {
  title: "Notifications",
  description: "Notifications page",
};

export default function UserNotificationsPage() {
  return (
    <div className="lg:mx-auto lg:w-3/4">
      <NotificationContainer />
    </div>
  );
}
