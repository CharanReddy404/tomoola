import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { UpdateArtistDto } from "./dto/update-artist.dto";

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateArtistDto) {
    const { artFormIds, ...profileData } = data;

    return this.prisma.$transaction(async (tx) => {
      const artistProfile = await tx.artistProfile.create({
        data: {
          groupName: profileData.groupName,
          basePrice: profileData.basePrice,
          basedIn: profileData.basedIn,
          ...(profileData.description != null && {
            description: profileData.description,
          }),
          ...(profileData.groupSize != null && {
            groupSize: profileData.groupSize,
          }),
          ...(profileData.priceUnit != null && {
            priceUnit: profileData.priceUnit,
          }),
          ...(profileData.serviceAreas != null && {
            serviceAreas: profileData.serviceAreas,
          }),
          ...(profileData.languages != null && {
            languages: profileData.languages,
          }),
          ...(profileData.experience != null && {
            experience: profileData.experience,
          }),
          userId,
          artForms: {
            create: artFormIds.map((artFormId) => ({ artFormId })),
          },
        },
        include: {
          user: true,
          artForms: { include: { artForm: true } },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { role: "ARTIST" },
      });

      return artistProfile;
    });
  }

  async update(artistProfileId: string, data: UpdateArtistDto) {
    const { artFormIds, ...profileData } = data;

    return this.prisma.$transaction(async (tx) => {
      if (artFormIds) {
        await tx.artistArtForm.deleteMany({
          where: { artistProfileId },
        });
      }

      return tx.artistProfile.update({
        where: { id: artistProfileId },
        data: {
          ...profileData,
          ...(artFormIds && {
            artForms: {
              create: artFormIds.map((artFormId) => ({ artFormId })),
            },
          }),
        },
        include: {
          user: true,
          artForms: { include: { artForm: true } },
        },
      });
    });
  }

  async findAll(filters: {
    artForm?: string;
    city?: string;
    search?: string;
  }) {
    const where: Record<string, unknown> = {
      isApproved: true,
      isActive: true,
    };

    if (filters.artForm) {
      where.artForms = {
        some: { artForm: { slug: filters.artForm } },
      };
    }

    if (filters.city) {
      where.basedIn = { contains: filters.city, mode: "insensitive" };
    }

    if (filters.search) {
      where.groupName = { contains: filters.search, mode: "insensitive" };
    }

    const artists = await this.prisma.artistProfile.findMany({
      where,
      include: {
        user: true,
        artForms: { include: { artForm: true } },
        media: { where: { removedAt: null } },
        reviews: { where: { removedAt: null } },
      },
    });

    return artists.map((artist) => {
      const avgRating =
        artist.reviews.length > 0
          ? artist.reviews.reduce((sum, r) => sum + r.rating, 0) /
            artist.reviews.length
          : null;
      return { ...artist, averageRating: avgRating };
    });
  }

  async findOne(id: string) {
    return this.prisma.artistProfile.findUnique({
      where: { id },
      include: {
        user: true,
        artForms: { include: { artForm: true } },
        media: { where: { removedAt: null }, orderBy: { sortOrder: "asc" } },
        availability: true,
        reviews: {
          where: { removedAt: null },
          include: { client: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async findByArtFormSlug(slug: string) {
    return this.prisma.artistProfile.findMany({
      where: {
        isApproved: true,
        isActive: true,
        artForms: { some: { artForm: { slug } } },
      },
      include: {
        user: true,
        artForms: { include: { artForm: true } },
        media: { where: { removedAt: null } },
        },
        });
        }
}
