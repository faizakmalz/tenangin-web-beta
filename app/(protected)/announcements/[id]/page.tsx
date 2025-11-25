import { FC } from 'react';

interface AnnouncementProps {
  params: { id: string };
}

const AnnouncementPage: FC<AnnouncementProps> = ({ params }) => {
  return (
    <div>
      <h1>Announcement {params.id}</h1>
      {/* Konten pengumuman berdasarkan ID */}
    </div>
  );
};

export default AnnouncementPage;
