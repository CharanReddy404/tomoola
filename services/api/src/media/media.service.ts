import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async addMedia(
    artistProfileId: string,
    data: { type: "PHOTO" | "VIDEO_LINK"; url: string; caption?: string },
  ) {
    const maxOrder = await this.prisma.media.aggregate({
      where: { artistProfileId },
      _max: { sortOrder: true },
    });

    return this.prisma.media.create({
      data: {
        artistProfileId,
        type: data.type,
        url: data.url,
        caption: data.caption,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async deleteMedia(mediaId: string, userId: string) {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      include: { artistProfile: true },
    });

    if (!media) {
      throw new NotFoundException("Media not found");
    }

    if (media.artistProfile.userId !== userId) {
      throw new ForbiddenException("You do not own this media");
    }

    return this.prisma.media.update({
      where: { id: mediaId },
      data: { removedAt: new Date() },
    });
  }

  async getByArtist(artistProfileId: string) {
    return this.prisma.media.findMany({
      where: { artistProfileId, removedAt: null },
      orderBy: { sortOrder: "asc" },
    });
  }

  async reorder(artistProfileId: string, mediaIds: string[]) {
    const updates = mediaIds.map((id, index) =>
      this.prisma.media.updateMany({
        where: { id, artistProfileId },
        data: { sortOrder: index },
      }),
    );

    await this.prisma.$transaction(updates);

    return this.getByArtist(artistProfileId);
  }
}
