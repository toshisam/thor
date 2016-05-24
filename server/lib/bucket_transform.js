function stdMetric(bucket) {
  const body = {};
  body[bucket.type] = {
    field: bucket.field
  };
  return body;
}

module.exports = {
  count: (bucket) => {
    return {
      bucket_script: {
        buckets_path: { count: '_count' },
        script: {
          inline: 'count * 1',
          lang: 'expression'
        },
      }
    };
  },
  avg: stdMetric,
  max: stdMetric,
  min: stdMetric,
  sum: stdMetric,
  cardinality: stdMetric,
  value_count: stdMetric,

  derivative: (bucket) => {
    const body = {
      derivative: {
        buckets_path: bucket.field
      }
    };
    if (bucket.options.gap_policy) body.gap_policy = bucket.options.gap_policy;
    if (bucket.options.units) body.units = bucket.options.units;
    return body;
  },

  moving_average: (bucket) => {
    const body = {
      moving_average: {
        buckets_path: bucket.field,
        model: bucket.option.model || 'simple'
      }
    };
    if (bucket.options.gap_policy) body.gap_policy = bucket.options.gap_policy;
    if (bucket.options.window) body.window = bucket.options.window;
    if (bucket.options.minimize) body.minimize = bucket.options.minimize;
    if (bucket.options.settings) body.settings = bucket.options.settings;
    return body;
  },

  calculation: (bucket) => {
    const body = {
      bucket_script: {
        buckets_path: bucket.options.vars,
        script: {
          inline: bucket.options.script,
          lang: 'expression'
        }
      }
    };
    if (bucket.options.gap_policy) body.gap_policy = bucket.options.gap_policy;
    return body;
  }
};
