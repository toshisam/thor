import settings from './settings.json';
export default (server) => {
  return () => {
    const { client } = server.plugins.elasticsearch;
    const config = server.config();
    return client.indices.create({
      index: config.get('thor.index'),
      body: settings,
      ignore: [400]
    });
  };
};
