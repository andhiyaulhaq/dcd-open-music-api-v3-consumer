const autoBind = require('auto-bind');

class Listener {
  constructor(playlistService, mailSender) {
    this.playlistService = playlistService;
    this.mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString(),
      );

      const playlist = await this.playlistService.getSongsFromPlaylist(
        playlistId,
      );
      const result = await this.mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlist),
      );
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
