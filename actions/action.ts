// app/actions/polls.ts

import { createClient } from "@/utils/supabase/server";


export type PollVote = {
  id: string;
  created_at: string;
  poll_id: string;
  user_id: string;
  option_indices: number[];
};

export type VoteStats = {
  optionIndex: number;
  votes: number;
  percentage: number;
  participationRate: number;
};

export async function getPollVotes(pollId: string): Promise<PollVote[]> {
  const supabase =  await  createClient()

  const { data: votes, error } = await supabase
    .from('poll_votes')
    .select('*')
    .eq('poll_id', pollId);

  if (error) {
    console.error('Error fetching poll votes:', error);
    throw error;
  }

  return votes || [];
}

export async function getRoomParticipants(roomId: string): Promise<number> {
  const supabase =  await  createClient()


  const { count, error } = await supabase
    .from('room_participants')
    .select('*', { count: 'exact' })
    .eq('room_id', roomId);

  if (error) {
    console.error('Error fetching room participants:', error);
    throw error;
  }

  return count || 0;
}

export async function calculateVoteStats(
  pollId: string,
  roomId: string,
  optionsCount: number
): Promise<VoteStats[]> {
  const [votes, totalParticipants] = await Promise.all([
    getPollVotes(pollId),
    getRoomParticipants(roomId)
  ]);

  const voteCounts = new Array(optionsCount).fill(0);
  votes.forEach(vote => {
    vote.option_indices.forEach(index => {
      voteCounts[index]++;
    });
  });

  const totalVotes = votes.length;

  return voteCounts.map((count, index) => ({
    optionIndex: index,
    votes: count,
    percentage: totalVotes > 0 ? (count / totalVotes) * 100 : 0,
    participationRate: totalParticipants > 0 ? (count / totalParticipants) * 100 : 0
  }));
}

export async function submitVote(
  pollId: string,
  userId: string,
  optionIndices: number[]
): Promise<void> {
  const supabase =  await  createClient()


  const { error } = await supabase
    .from('poll_votes')
    .insert({
      poll_id: pollId,
      user_id: userId,
      option_indices: optionIndices
    });

  if (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
}