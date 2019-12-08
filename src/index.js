import $ from 'jquery';

import './index.scss';

import GraphSearch from './graph/graphSearch';

$(() => {
  const $grid = $('#searchGrid');
  const $wallFrequencySelect = $('#wallFrequencySelect');
  const $selectGridSize = $('#selectGridSize');
  const $selectCellSize = $('#selectCellSize');
  const $checkDebug = $('#checkDebug');
  const $searchDiagonal = $('#searchDiagonal');

  const options = {
    wallFrequency: $wallFrequencySelect.val(),
    gridSize: $selectGridSize.val(),
    cellSize: $selectCellSize.val(),
    debug: $checkDebug.is('checked'),
    diagonal: $searchDiagonal.is('checked'),
  };

  const grid = new GraphSearch($grid, options);

  $('#btnGenerate').click(() => {
    const { cellSize, gridSize } = grid.options;

    $('#searchGrid').css({
      width: `${cellSize * gridSize}`,
      height: `${cellSize * gridSize}`,
    });

    grid.initialize();
  });

  $wallFrequencySelect.change(function onChangeWallFrequency() {
    grid.setOption({ wallFrequency: $(this).val() });
  });

  $selectCellSize.change(function onChangeCellSize() {
    grid.setOption({ cellSize: $(this).val() });
  });

  $selectGridSize.change(function onChangeGridSize() {
    grid.setOption({ gridSize: $(this).val() });
  });

  $checkDebug.change(function onChangeCheckDebug() {
    grid.setOption({ debug: $(this).is(':checked') });
  });

  $searchDiagonal.change(function onChangeSearchDiagonal() {
    grid.setOption({ diagonal: $(this).is(':checked') });
  });

  $('#generateWeights').click(() => {
    if ($('#generateWeights').prop('checked')) {
      $('#weightsKey').slideDown();
    } else {
      $('#weightsKey').slideUp();
    }
  });
});
