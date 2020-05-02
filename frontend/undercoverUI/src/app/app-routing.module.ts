import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRoomComponent } from './create-room/create-room.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';
import { RulesComponent } from './rules/rules.component';



const routes: Routes = [
  { path: '', component: CreateRoomComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'lobby/:id', component: LobbyComponent },
  { path: 'game/:id', component: GameComponent },
  { path: 'rules', component: RulesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
