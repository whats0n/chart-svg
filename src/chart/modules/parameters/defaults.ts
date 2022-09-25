export default {
  responsive: true,

  endpoints: { start: true, end: true },

  size: {
    width: 500,
    height: 200,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },

  style: {
    path: {
      strokeColor: 'none',
      strokeWidth: 2,
      fill: 'none',
      strokeLinejoin: 'round',
      strokeLinecap: 'round',
      shadow: '0 0 0 rgba(0,0,0,0)',
    },

    point: {
      strokeWidth: 0,
      strokeColor: 'none',
      fill: 'none',
      shadow: '0 0 0 rgba(0,0,0,0)',
      size: 0,
    },
  },
}
