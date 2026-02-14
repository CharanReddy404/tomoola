import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ArtFormsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const artForms = await this.prisma.artForm.findMany({
      include: {
        _count: {
          select: {
            artists: {
              where: {
                artistProfile: { isApproved: true, isActive: true },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return artForms.map((af) => ({
      ...af,
      artistCount: af._count.artists,
      _count: undefined,
    }));
  }

  async findBySlug(slug: string) {
    return this.prisma.artForm.findUnique({
      where: { slug },
      include: {
        artists: {
          where: {
            artistProfile: { isApproved: true, isActive: true },
          },
          include: {
            artistProfile: {
              include: {
                user: true,
                media: { where: { removedAt: null } },
              },
            },
          },
        },
      },
    });
  }
}
