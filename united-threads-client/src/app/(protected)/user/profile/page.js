import ProfileContainer from "./_components/ProfileContainer";

export const metadata = {
  title: "Profile",
  description: "Profile page",
};

export default function ProfilePage() {
  return (
    <div className="lg:mx-auto lg:w-3/4">
      <ProfileContainer />
    </div>
  );
}
