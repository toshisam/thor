import { jstz } from 'jstimezonedetect';
import moment from 'moment';
var app = require('ui/modules').get('apps/thor/services', []);
app.service('$timezone', (config, Private) => {
  return {
    resolve() {
      var configuredTZ = config.get('dateFormat:tz', 'Browser');
      var configDefaults = Private(require('ui/config/defaults'));
      var detectedTimezone = jstz.determine().name();
      var isDefaultTimezone;

      try {
        isDefaultTimezone = configuredTZ === configDefaults['dateFormat:tz'].value;
      } catch (e) {
        return detectedTimezone;
      }

      var timezone = isDefaultTimezone ?
        (detectedTimezone || moment().format('Z')) :
        configuredTZ;

      return timezone;
    }
  };
});
