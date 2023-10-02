'use strict';

/**
 * fooditem service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::fooditem.fooditem');
