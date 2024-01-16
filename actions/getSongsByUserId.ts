import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { Song } from '@/types';

const getSongsByUserId = async (): Promise<Song[]> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	//get the session data
	const { data: sessionData, error: sessionError } =
		await supabase.auth.getSession();

	//if there is an error, log it
	if (sessionError) {
		console.log(sessionError.message);
		return [];
	}

	//get all songs from the database
	const { data, error } = await supabase
		.from('songs')
		.select('*')
		.eq('user_id', sessionData.session?.user.id)
		.order('created_at', { ascending: false });

	//if there is an error, log it
	if (error) {
		console.log(error.message);
	}

	return (data as any) || [];
};

export default getSongsByUserId;
