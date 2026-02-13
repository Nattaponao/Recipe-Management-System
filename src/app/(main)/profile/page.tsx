import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileActions from '@/components/profile/ProfileActions';
import ProfileRecipeCard from '@/components/profile/ProfileRecipeCard';

export default function ProfilePage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <ProfileHeader name="Wavi" username="@Wavi" avatar="/profilemen.jpg" />

      <ProfileStats followers={10} following={0} likes={5} />

      <ProfileActions />

      <div className="mt-10">
        <ProfileRecipeCard
          title="Shrimp Fried Rice"
          image="/demofood.jpg"
          category="Rice"
          author="Wavi"
          date="March 20, 2022"
          avatar="/profilemen.jpg"
        />
      </div>
    </section>
  );
}
