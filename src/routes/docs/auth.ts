export const GetAuthSchema = {
  description: 'Gets auth',
  tags: ['auth'],
  summary: 'Gets auth',
  params: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        description: 'Username'
      },
      password: {
        type: 'string',
        description: 'Password'
      }
    }
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'string'
    },
  },
};
