class FindSchemas {
  getAllPosts() {
    return {
      include: {
        likes: true,
        author: {
          select: {
            avatarUrl: true,
            name: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    };
  }
  getPostById(postId) {
    return {
      where: {
        id: postId,
      },
      include: {
        comments: {
          include: {
            user: {
              select: {
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        likes: true,
        author: {
          select: {
            id: true,
            avatarUrl: true,
          },
        },
      },
    };
  }
}

export default new FindSchemas();
