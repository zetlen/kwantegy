module.exports = function callParent(name, ctx, args) {
  return ctx.super_.prototype[name].apply(ctx, args);
}