import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = "Chain reaction";
  n: number = 4;
  m: number = 4;
  steps = 0;
  board: any = [];
  curr_player: any = 0; //0 for player1 and 1 for player2
  player: any = {
    count: 2,
    curr: {
      player: {
        name: null,
        color: null
      }
    }
  };
  ngOnInit() {
    // this.setPlayer(this.player);
    this.startBoard(this.board, this.n, this.m);
  }
  startBoard(board, n, m) {
    for (let i = 0; i < n; i++) {
      let temp = [];
      for (let j = 0; j < m; j++) {
        temp.push({ count: 0, color: null, player: null });
      }
      board.push(temp);
    }
    this.board = board;
  }
  updateBoard = (board, n, m, i, j, e) => {
    this.steps++;
    if (e != null) {
      //case1 : first time move
      board[i][j].count += 1;
      let result = this.isBreaking(board, n, m, i, j);
      if (board[i][j].count == 1) {
        board[i][j].player = this.curr_player;
      }
      //case2 : just increment if already have some and not breaking
      else if (this.isBreaking(board, n, m, i, j).success == false) {
        board[i][j].player = this.curr_player;
      }
      //case3 : increment and also breaking condition 

      this.curr_player = !this.curr_player;
      board[i][j].count -= 1;
    }
    board[i][j].count += 1;
    let result = this.isBreaking(board, n, m, i, j);
    if (result.success) {
      this.curr_player = !this.curr_player;
      let resType = result.type;
      board[i][j].count = 0;
      board[i][j].player = null;
      if (resType.name == 'boundary') {
        if (resType.direction == 'top') {
          this.updateBoard(board, n, m, i, j - 1, null);
          this.updateBoard(board, n, m, i + 1, j, null);
          this.updateBoard(board, n, m, i, j + 1, null);
        }
        if (resType.direction == 'bottom') {
          this.updateBoard(board, n, m, i - 1, j, null);
          this.updateBoard(board, n, m, i, j + 1, null);
          this.updateBoard(board, n, m, i, j - 1, null);
        }
        if (resType.direction == 'left') {
          this.updateBoard(board, n, m, i - 1, j, null);
          this.updateBoard(board, n, m, i + 1, j, null);
          this.updateBoard(board, n, m, i, j + 1, null);
        }
        if (resType.direction == 'right') {
          this.updateBoard(board, n, m, i - 1, j, null);
          this.updateBoard(board, n, m, i, j - 1, null);
          this.updateBoard(board, n, m, i + 1, j, null);
        }
      }
      if (resType.name == 'corner') {
        if (resType.direction == 'top-left') {
          this.updateBoard(board, n, m, i + 1, j, null);
          this.updateBoard(board, n, m, i, j + 1, null);
        }
        if (resType.direction == 'top-right') {
          this.updateBoard(board, n, m, i + 1, j, null);
          this.updateBoard(board, n, m, i, j - 1, null);
        }
        if (resType.direction == 'bottom-left') {
          this.updateBoard(board, n, m, i - 1, j, null);
          this.updateBoard(board, n, m, i, j + 1, null);
        }
        if (resType.direction == 'bottom-right') {
          this.updateBoard(board, n, m, i - 1, j, null);
          this.updateBoard(board, n, m, i, j - 1, null);
        }
      }
      if (resType.name == 'inner') {
        this.updateBoard(board, n, m, i + 1, j, null);
        this.updateBoard(board, n, m, i - 1, j, null);
        this.updateBoard(board, n, m, i, j - 1, null);
        this.updateBoard(board, n, m, i, j + 1, null);
      }
    }
    return;
  }
  isBreaking: any = (board, n, m, i, j) => {
    let pos = this.getPosition(n, m, i, j);
    if (pos == 'boundary' && board[i][j].count == 3) {
      if (i == 0) {
        return {
          success: true,
          type: { name: 'boundary', direction: 'top' }
        }
      }
      if (i == n - 1) {
        return {
          success: true,
          type: { name: 'boundary', direction: 'bottom' }
        }
      }
      if (j == 0) {
        return {
          success: true,
          type: { name: 'boundary', direction: 'left' }
        }
      }
      if (j == m - 1) {
        return {
          success: true,
          type: { name: 'boundary', direction: 'right' }
        }
      }
    }
    if (pos == 'corner' && board[i][j].count == 2) {
      if (i == 0 && j == 0) {
        return {
          success: true,
          type: { name: 'corner', direction: 'top-left' }
        }
      }
      if (i == n - 1 && j == 0) {
        return {
          success: true,
          type: { name: 'corner', direction: 'bottom-left' }
        }
      }
      if (i == n - 1 && j == m - 1) {
        return {
          success: true,
          type: { name: 'corner', direction: 'bottom-right' }
        }
      }
      if (i == 0 && j == m - 1) {
        return {
          success: true,
          type: { name: 'corner', direction: 'top-right' }
        }
      }
    }
    if (pos == 'inner' && board[i][j].count == 4) {
      return { success: true, type: { name: 'inner', direction: null } };
    }
    return { success: false, type: null };
  }
  getPosition: any = (n, m, i, j) => {
    //Right
    if (i == 0) {
      if (j == 0) {
        return 'corner';
      }
      if (j == m - 1) {
        return 'corner';
      } else {
        return 'boundary';
      }
    }
    // Down
    if (j == 0) {
      if (i == n - 1) {
        return 'corner';
      }
      return 'boundary';
    }
    if (i == n - 1) {
      if (j == m - 1) {
        return 'corner';
      }
      return 'boundary';
    }
    if (j == m - 1) {
      return 'boundary';
    }
    return 'inner';
  }
  setPlayer(player: any) {
    for (let i = 0; i < player.count; i++) {

    }
  }
}

