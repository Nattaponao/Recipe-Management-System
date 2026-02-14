import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileActions from '@/components/profile/ProfileActions';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="p-10">Please login</div>;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <ProfileHeader
        name={session.user?.name ?? 'User'}
        username={session.user?.email ?? ''}
        avatar="/profilemen.jpg"
      />

      <ProfileStats followers={0} following={0} likes={0} />

      <ProfileActions />
    </section>
  );
}
